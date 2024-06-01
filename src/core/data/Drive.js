const Drive = {
    init(clientId, token, db_name) {
        this._clientId = clientId;
        this._token = token;
        this._db_name = db_name;
        this._fname = db_name + '.json';
    },

    async tryRetrieveDb(setError) {
        try {
            const file = await this.checkFileInAppData();
            if (file) {
                console.log('File exists:', file);
                const content = await this.downloadFileContent(file.id);
                console.log('File content:', content);
                // Handle the existing file content here
            } else {
                console.log('File does not exist');
                // Handle the case where the file does not exist here
            }
        } catch (error) {
            setError(error);
        }
    },

    async checkFileInAppData() {
        const url = 'https://www.googleapis.com/drive/v3/files';
        const params = {
            spaces: 'appDataFolder',
            q: `name='${this._fname}' and trashed=false`,
            fields: 'files(id, name)'
        };

        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${url}?${queryString}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this._token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching file list: ${response.statusText}`);
        }

        const data = await response.json();
        return data.files.length > 0 ? data.files[0] : null;
    },

    async downloadFileContent(fileId) {
        const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this._token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error downloading file content: ${response.statusText}`);
        }

        return await response.json();
    },

    async saveJsonToAppData(jsonData, setError) {
        try {
            const file = await this.checkFileInAppData();
            if (file) {
                await this.updateFileInAppData(file.id, jsonData);
                console.log('File updated successfully');
            } else {
                await this.createFileInAppData(jsonData);
                console.log('File created successfully');
            }
        } catch (error) {
            setError(error);
        }
    },

    async createFileInAppData(jsonData) {
        const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        const metadata = {
            name: this._fname,
            parents: ['appDataFolder']
        };

        const boundary = '-------314159265358979323846';
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        const body =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(jsonData) +
            closeDelimiter;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this._token}`,
                'Content-Type': `multipart/related; boundary="${boundary}"`
            },
            body: body
        });

        if (!response.ok) {
            throw new Error(`Error creating file: ${response.statusText}`);
        }

        return await response.json();
    },

    async updateFileInAppData(fileId, jsonData) {
        const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
        const metadata = {
            name: this._fname
        };

        const boundary = '-------314159265358979323846';
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        const body =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(jsonData) +
            closeDelimiter;

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${this._token}`,
                'Content-Type': `multipart/related; boundary="${boundary}"`
            },
            body: body
        });

        if (!response.ok) {
            throw new Error(`Error updating file: ${response.statusText}`);
        }

        return await response.json();
    }
};

export default Drive;
