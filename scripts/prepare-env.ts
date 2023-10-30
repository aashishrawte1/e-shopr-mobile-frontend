import * as shell from 'shelljs';
import * as fs from 'fs';
const args = process.argv.slice(2);

if (args.length < 1) {
  throw Error('Missing arguments.');
}

const env = args[0] !== 'live' ? 'uat' : 'live';

let androidSource = 'config/google-services';
const androidDestination = 'google-services.json';
let iosSource = 'config/GoogleService-Info';
const iosDestination = 'GoogleService-Info.plist';
if (args[0] === 'uat') {
  androidSource += '.json';
  iosSource += '.plist';
} else if (args[0] === 'live') {
  androidSource += '-live.json';
  iosSource += '-live.plist';
} else {
  throw Error('wrong environment passed.');
}

// IOS replacements
const fileReplacements = {
  uat: [
    {
      source: 'ios/App/App/GoogleService-Info.uat.plist',
      target: 'ios/App/App/GoogleService-Info.plist',
    },
    {
      source: 'android/app/google-services.uat.json',
      target: 'android/app/google-services.json',
    },
  ],
  live: [
    {
      source: 'ios/App/App/GoogleService-Info.live.plist',
      target: 'ios/App/App/GoogleService-Info.plist',
    },
    {
      source: 'android/app/google-services.live.json',
      target: 'android/app/google-services.json',
    },
  ],
};
for (const replacement of fileReplacements[env]) {
  shell.cp('-R', replacement.source, replacement.target);
}
const pListFile = fs
  .readFileSync('ios/App/App/GoogleService-Info.plist')
  .toString()
  .replace(/\s/g, '');

const match = pListFile.match(/REVERSED_CLIENT_ID(.*?)<\/string>/g)[0];
const reverseClientId = match.substring(
  match.indexOf('<string>') + 8,
  match.indexOf('</string>')
);
shell.sed(
  '-i',
  /"REVERSED_CLIENT_ID(.*?),/g,
  `"REVERSED_CLIENT_ID": "${reverseClientId}",`,
  ['package.json']
);

const frontendServerUrls = {
  uat: 'https://user-portal-uat.greendayapp.com',
  live: 'https://user-portal-prod.greendayapp.com',
};

const capacitorFilePath = 'capacitor.config.json';
const capacitorSettings = JSON.parse(
  fs.readFileSync(capacitorFilePath).toString()
);
capacitorSettings.server = {
  url: frontendServerUrls[env],
  originalUrl: frontendServerUrls[env],
};

fs.writeFileSync(
  capacitorFilePath,
  JSON.stringify(capacitorSettings, null, 2),
  {
    encoding: 'utf-8',
  }
);
