<h3 id="streamDialogTitle"><span class="StreamDetailsTitle"><strong><?php echo count($streams)+count($lists); ?></strong> results for "<?php echo $keyword; ?>"</span></h3>
<div class="SearchBoxContainer">
    <input class="TextInput GlobalSearchBoxAlt" type="text" placeholder="You can search for Task and Plan" id="zwGlobalSearchAlt" value="<?php echo $keyword; ?>" />
</div>
<?php if ( count($streams)+count($lists) > 0 ) : ?>
<div class="SearchResultContent" id="searchResultContent">
    <?php
        $maxlength = 150;
        if ( count($streams) > 0 ) {
            echo '<h2>Task</h2>';
            echo '<ul class="SearchResultList">';
            foreach ( $streams as $_r ) {
                //build 'url' link for details view of deliverable
                $url = Configure::read('root_url').'/planner#!'.$_r['Stream_list'][0]['id'].'?sid='.$_r['Stream']['id'];
                echo '<li>';
                echo '    <a target="_blank" href="'.$url.'" title="'.$_r['Stream']['name'].'">';
                echo preg_replace(
                    '/(?![^&;]+;)(?!<[^<>]*)('.$keyword.')(?![^<>]*>)(?![^&;]+;)/i',
                    '<strong>$1</strong>',
                    $_r['Stream']['name']
                );
                echo '</a>';
                $description = urldecode($_r['Stream']['description']);
                echo '    <p>'.htmlspecialchars(strlen($description) < $maxlength ? $description : mb_substr($description, 0, $maxlength).'...').'</p>';
                echo '    <p class="TextAlt01">Created by</strong>&nbsp;'.$_r['Creator']['username'].'</p>';
                echo '</li>';
            }
            echo '</ul>';
        }

        if ( count($lists) > 0 ) {
            echo '<h2>Plan</h2>';
            echo '<ul class="SearchResultList">';
            foreach ( $lists as $_r ) {
                //build 'url' link for details view of deliverable
                $url = Configure::read('root_url').'/planner#!'.$_r['Stream_list']['id'];
                echo '<li>';
                echo '    <a target="_blank" href="'.$url.'" title="'.$_r['Stream_list']['name'].'">';
                echo preg_replace(
                    '/(?![^&;]+;)(?!<[^<>]*)('.$keyword.')(?![^<>]*>)(?![^&;]+;)/i',
                    '<strong>$1</strong>',
                    $_r['Stream_list']['name']
                );
                echo '</a>';
                $description = urldecode($_r['Stream_list']['description']);
                echo '    <p>'.(strlen($description) < $maxlength ? $description : substr($description, 0, $maxlength).'...').'</p>';
                echo '    <p class="TextAlt01">Created by</strong>&nbsp;'.$_r['Creator']['username'].'</p>';
                echo '</li>';
            }
            echo '</ul>';
        }
    ?>
</div>
<?php endif; ?>