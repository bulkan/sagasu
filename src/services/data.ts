import * as fs from 'fs';
import * as path from 'path';
import JSONStream from 'JSONStream';

export class DataService {
  public dataRoot = path.join(__dirname, '..', '..', 'data');
  public users = path.join(this.dataRoot, 'large-users.json');
  public organizations = path.join(this.dataRoot, 'organizations.json');
  public tickets = path.join(this.dataRoot, 'tickets.json');

  public contentTypeFilePaths = {
    users: this.users,
    organizations: this.organizations,
    tickets: this.tickets
  };

  public getKeysFromContentType({ contentType }: { contentType?: string }): Promise<string[]> {
    if (!contentType || !contentType.length) {
      return Promise.reject(new Error(`Missing contentType`));
    }

    return new Promise((resolve, reject) => {
      const keyParser = JSONStream.parse([{ emitKey: true }]);
      const contentTypeFilePath = this.contentTypeFilePaths[contentType.toLowerCase()];
      const stream = fs.createReadStream(contentTypeFilePath)
        .pipe(keyParser);

      let keys = new Set();

      stream.on('end', () => resolve([...keys] as string[]));
      stream.on('error', reject);
      stream.on('data', ({ value }) => {
        const newKeys = new Set(Object.keys(value));
        keys = new Set([...keys, ...newKeys]);
      });
    });
  }

  public queryByField({ contentType, field, query = '' }): Promise<string[]>  {
    const parser = JSONStream.parse('*');

    return new Promise((resolve, reject) => {
      const contentTypeFilePath = this.contentTypeFilePaths[contentType.toLowerCase()];
      const stream = fs.createReadStream(contentTypeFilePath)
        .pipe(parser);

      const results = [];

      stream.on('end', () => resolve(results));
      stream.on('error', reject);
      stream.on('data', (data) => {
        const val = data[field];

        if (val && val.toString().indexOf(query) > -1) {
          results.push(data);
        }
      });
    });
  }
}

export const makeDataService = () => new DataService();
