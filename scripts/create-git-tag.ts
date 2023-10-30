import * as SimpleGit from 'simple-git/promise';
import * as fs from 'fs';

const VERSION_LOCATION = `src/assets/versioning`;
console.log('info', '', process.env.NODE_ENV);
if (!process.env.NODE_ENV) {
  console.error('no environment argument passed');
  process.exit(1);
}

const env = process.env.NODE_ENV as 'live';
const git = SimpleGit();

export class CreateGitTag {
  async doJob() {
    await this.pullFromMaster();
    /* this line is important to make sure at the time of 
    releasing, the hash we are getting is the latest. 
    otherwise, it gets a hash that is from last commit but just now there are many files that are uncommitted. 
    */
    await this.isStatusClean();
    await this.pushChangeToRemote();
    await this.getCommitHash();
  }

  async pushChangeToRemote() {
    const currentBranchName = (await git.branchLocal()).current;
    console.log({ currentBranchName });
    await git
      .push('origin', currentBranchName, { '-u': true })
      .catch((error) => {
        process.exit(1);
      });
    return true;
  }

  async pullFromMaster() {
    await git.pull('origin', 'master').catch((error) => {
      process.exit(1);
    });
    return true;
  }

  async isStatusClean() {
    // Check there is no pending commit
    const status = await git.status();

    if (!status.isClean()) {
      console.error('Please commit all changes first');
      process.exit(1);
    }

    return true;
  }

  async addTag() {
    try {
      const oldVersion = JSON.parse(
        fs
          .readFileSync(`${VERSION_LOCATION}/${env}.json`, {
            encoding: 'utf8',
          })
          .trim()
      ).version;
      let newVersion = this.increment(oldVersion);

      const lastCommitMessage = (await git.log()).latest.message;

      const latestTag = (await git.tags()).latest;
      if (latestTag) {
        if (+newVersion.replace(/./g, '') <= +latestTag.replace(/./g, '')) {
          newVersion = this.increment(latestTag);
        }
      }
      fs.writeFileSync(
        `${VERSION_LOCATION}/${env}.json`,
        JSON.stringify({ version: newVersion }),
        {
          encoding: 'utf8',
        }
      );
      await git.addAnnotatedTag(newVersion, lastCommitMessage).catch((_) => {
        process.exit(1);
      });

      console.log(latestTag);
      return true;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  async getCommitHash() {
    try {
      const lastCommitMessage = (await git.log()).latest.hash;
      if (!fs.existsSync(VERSION_LOCATION)) {
        fs.mkdirSync(VERSION_LOCATION);
      }

      fs.writeFileSync(
        `${VERSION_LOCATION}/${env}.json`,
        JSON.stringify({ version: lastCommitMessage }),
        {
          encoding: 'utf8',
        }
      );
      return true;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  sleep(second: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, second * 1000);
    });
  }

  increment(version: string) {
    const terms = version.split('.').map((e: string) => {
      return parseInt(e, 10);
    });
    if (terms.length !== 3) {
      return version;
    }
    if (++terms[2] > 9) {
      ++terms[1];
      terms[2] = 0;
    }
    return terms.join('.');
  }

  incrementMajor(version: string) {
    return [parseInt(version.split('.')[0], 10) + 1, 0, 0].join('.');
  }
}

new CreateGitTag().doJob();
