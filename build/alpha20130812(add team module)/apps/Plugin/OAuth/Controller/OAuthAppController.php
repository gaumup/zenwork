<?php
    App::import('Vendor', 'oauth2-php/lib/OAuth2');
    App::import('Vendor', 'oauth2-php/lib/IOAuth2Storage');
    App::import('Vendor', 'oauth2-php/lib/IOAuth2GrantCode');
    App::import('Vendor', 'oauth2-php/lib/IOAuth2RefreshTokens');

    class OAuthAppController extends AppController {
        public $components = array('Auth', 'Security');
        public $uses = array('User');
        private $blackHoled = false;

        /**
         * beforeFilter
         *
         */
        public function beforeFilter () {
            parent::beforeFilter();

            //configure 'Auth' components
            $this->Auth->allow('authenticate', 'authorize', 'access_token');

            //configure 'OAuth' components
            $this->OAuth->allow('authenticate', 'authorize', 'access_token');

            //configure 'Security' components
            $this->Security->blackHoleCallback = 'blackHole';
            $this->Security->csrfCheck = false;
            $this->Security->validatePost = false;
        }

        /**
         * Authenticate
         *
         * Users must authorize themselves before granting the app(client) authorization
         * Allows login state to be maintained after authorization
         *
         */
        public function authenticate () {
            $this->redirect(Configure::read('root_url').'/auth/login?oauth_redirect=1&'.http_build_query($this->request->query, '', '&'));
        }

        /**
         * Authorize Endpoint
         *
         * Send users here first for authorization_code grant mechanism
         *
         * Required params (GET or POST):
         *	- response_type = code
         *	- client_id
         *	- redirect_url
         *
         */
        public function authorize () {
            $this->layout = 'default';

            //how to check client_secret ?
            //if send client_secret from client to service provider, it may be revealed
            //if ( !$this->OAuth->checkClientCredentials($_GET['client_id']) ) { return; }

            if ( !$this->Auth->login() ) {
                $this->redirect(array('action' => 'authenticate', '?' => $this->request->query));
            }

            $userId = $this->Auth->user('id');

            if ( $this->request->is('post') ) {
                $this->validateRequest();

                /*
                if ( $this->Session->check('OAuth.logout') ) {
                    $this->Auth->logout();
                    $this->Session->delete('OAuth.logout');
                }
                */

                $accepted = $this->request->data['accept'] == 'Yes';
                try {
                    $this->OAuth->finishClientAuthorization($accepted, $userId, $this->request->data['Authorize']);
                } catch (OAuth2RedirectException $e) {
                    $e->sendHttpResponse();
                }
            }

            //Clickjacking prevention (supported by IE8+, FF3.6.9+, Opera10.5+, Safari4+, Chrome 4.1.249.1042+)
            $this->response->header('X-Frame-Options: DENY');

            if ( $this->Session->check('OAuth.params') ) {
                $OAuthParams = $this->Session->read('OAuth.params');
                $this->Session->delete('OAuth.params');
            } else {
                try {
                    $OAuthParams =  $this->OAuth->getAuthorizeParams();
                } catch (Exception $e){
                    $e->sendHttpResponse();
                }
            }

            //check if client has been allow in AuthCode, redirect without asking for permission
            $this->loadModel('AuthCode');
            $this->AuthCode->deleteAll(
                array(
                    'AuthCode.client_id' => $OAuthParams['client_id'],
                    'AuthCode.user_id' => $userId
                ),
                false
            );
            //if AuthCode exist and deleted, auto renew without re-asking for permissions
            if ( $this->AuthCode->getAffectedRows() > 0 ) {
                //create new AuthCode and redirect
                $this->OAuth->finishClientAuthorization('Yes', $userId, $OAuthParams);
            }

            $this->set(compact('OAuthParams'));
        }

        /**
         * Token Endpoint - this is where clients can retrieve an access token
         *
         * Grant types and parameters:
         * 1) authorization_code - exchange code for token
         *	- grant_type
         *	- code
         *	- redirect_uri
         *	- client_id
         *	- client_secret
         *
         * 2) refresh_token - exchange refresh_token for token
         *	- refresh_token
         *	- client_id
         *	- client_secret
         *
         * 3) password - exchange raw details for token
         *	- username
         *	- password
         *	- client_id
         *	- client_secret
         *
         */
        public function access_token () {
            $this->autoRender = false;
            try {
                $this->OAuth->grantAccessToken($this->data);
            } catch (OAuth2ServerException $e) {
                $e->sendHttpResponse();
            }
        }

        /**
         * Blackhold callback
         *
         * OAuth requests will fail postValidation, so rather than disabling it completely
         * if the request does fail this check we store it in $this->blackHoled and then
         * when handling our forms we can use $this->validateRequest() to check if there
         * were any errors and handle them with an exception.
         * Requests that fail for reasons other than postValidation are handled here immediately
         * using the best guess for if it was a form or OAuth
         *
         * @param string $type
         */
        public function blackHole ($type) {
            $this->blackHoled = $type;

            if ($type != 'auth') {
                if (isset($this->request->data['_Token'])) {
                    //Probably our form
                    $this->validateRequest();
                } else {
                    //Probably OAuth
                    $e = new OAuth2ServerException(OAuth2::HTTP_BAD_REQUEST, OAuth2::ERROR_INVALID_REQUEST, 'Request Invalid.');
                    $e->sendHttpResponse();
                }
            }
        }

        /**
         * Check for any Security blackhole errors
         *
         * @throws BadRequestException
         */
        private function validateRequest () {
            if ($this->blackHoled) {
                //Has been blackholed before - naughty
                throw new BadRequestException(__d('OAuth', 'The request has been black-holed'));
            }
        }
    }
?>
