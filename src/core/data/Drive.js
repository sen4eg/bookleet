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
            console.log("FILE", file);
            if (file) {
                console.log('File exists:', file);
                const result = await this.downloadFileContent(file.id);
                console.log("RESULT", result);
                return result;
            } else {
                console.log('File does not exist');
                return null;
            }
        } catch (error) {
            setError(error);
            return null;
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
        const fetchUrl = `${url}?${queryString}`;

        try {
            const response = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this._token}`
                }
            });

            if (!response.ok) {
                console.log("RESPONSE", response);
                console.log("RESPONSE", response.statusText);
                console.error("Error fetching file list:", response.statusText);
                return null;
            }

            const data = await response.json();
            return data.files.length > 0 ? data.files[0] : null;
        } catch (error) {
            console.error("Error in checkFileInAppData:", error);
            throw error;
        }
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

        return response.json();
    },

    async saveJsonToAppData(jsonData, setError, onsucces) {
        try {
            console.log('Saving JSON to AppData');
            const file = await this.checkFileInAppData();
            if (file) {
                await this.updateFileInAppData(file.id, jsonData).then(onsucces);
                // console.log('File updated successfully');
            } else {
                await this.createFileInAppData(jsonData).then(onsucces);
                // console.log('File created successfully');
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
        const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${this._token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });
        console.log("RESPONSE", response);
        if (!response.ok) {
            throw new Error(`Error updating file: ${response.statusText}`);
        }

        return await response.json();
    }
};

export default Drive;
