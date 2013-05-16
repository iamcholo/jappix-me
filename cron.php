<?php

/*
 * Jappix Me - Your public profile, anywhere
 * CRON service
 * 
 * License: AGPL
 * Author: Valérian Saliou
 */


// Initialize
include('./php/config.php');
include('./php/functions.php');

// Disable PHP error reporting
if(getConfig('app', 'mode') != 'development') {
	ini_set('display_errors', 'off');
	ini_set('error_reporting', 0);
}

// Don't allow non-CLI requests
if(sourceClient() != 'cli')
	exit('Command-Line CRON Service. Please call me from your shell.');

// Greet the shell user
print('[cron] Welcome, master!'."\n");
print('[cron] Scanning users...'."\n");
print("\n");

// Regenerate updated user data
$count_update = 0;
$available_users = scandir('./cache');

foreach($available_users as $current_user) {
	// Not a XID?
	if(!strpos($current_user, '@'))
		continue;

	// Check for fresh raw data
	$exists_vcard = file_exists('./cache/'.$current_user.'/raw/vcard');
	$exists_microblog = file_exists('./cache/'.$current_user.'/raw/microblog');
	$exists_geoloc = file_exists('./cache/'.$current_user.'/raw/geoloc');

	// Check a raw file is available
	if($exists_vcard && $exists_microblog && $exists_geoloc) {
		print('[cron] Regenerating storage for '.$current_user.'...'."\n");

		$count_update++;

		// Regenerate user XMPP data
		$current_data = requestXMPPData($current_user);

		// Any avatar for this user?
		$exists_avatar = false;

		if(isset($current_data['vcard'])) {
			$current_vcard_arr = $current_data['vcard'][0]['sub'];
			print('1'."\n");
			if(isset($current_vcard_arr['photo'])) {
				$current_vcard_photo = $vcard_arr['photo'][0]['sub'];
				print('2'."\n");
				// User has an avatar
				if(isset($current_vcard_photo['type']) && isset($current_vcard_photo['binval'])) {
					print('3'."\n");
					// Get avatar data
					$current_avatar_binval = $current_vcard_photo['binval'];
					$current_avatar_type = $current_vcard_photo['type'];

					if(!$current_avatar_type)
						$current_avatar_type = 'png';

					// Avatar exists?
					if($current_avatar_binval && preg_match('/^(png|jpg|gif)$/', $current_avatar_type))
						$exists_avatar = true;
				}
			}
		}

		if($exists_avatar)
			writeCache($current_user, 'avatar', 'exists', '');
		else
			writeCache($current_user, 'avatar', 'not_exists', '');
	}
}

// Nobody updated?
if($count_update == 0)
	print('[cron] Nothing to do.'."\n");

// All done!
print("\n");
print('[cron] Done.'."\n");
print('[cron] Bye Bye!'."\n");

exit;