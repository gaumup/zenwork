<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Zenwork</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" valign="top">
                <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;background-color:#72B6DB;" bgcolor="#72B6DB">
                    <tr>
                        <td align="left" valign="top" style="font-family:Verdana;font-size:40px;color:#ffffff;font-weight:bolder;padding:0 10px;">Zenwork</td>
                    </tr>

                    <tr>
                        <td align="center" valign="top" bgcolor="#176690" style="background-color:#176690; font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000000;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="5">
                                <tr>
                                    <td width="50%" align="left" valign="top" style="color:#ffffff; font-family:Verdana, Geneva, sans-serif; font-size:11px;">&nbsp;&nbsp;<?php echo date('d-M-Y', isset($date) ? $date : time()); ?></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content body -->
                    <tr>
                        <td align="center" valign="top" bgcolor="#ffffff" style="border:1px solid #176690;background-color:#ffffff; font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000000; padding:12px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="10" style="margin-bottom:10px;">
                                <tr>
                                    <td align="left" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#525252;">
                                        <?php echo $content_for_layout; ?>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- END. -->

                    <tr>
                        <td align="left" valign="top" bgcolor="#176690" style="background-color:#176690;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="15">
                                <tr>
                                    <td align="left" valign="top" style="color:#ffffff; font-family:Arial, Helvetica, sans-serif; font-size:13px;">&copy; copyright by Zenwork.</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>