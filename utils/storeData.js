import fs from 'fs';

let filePath = './data.json'

const storeData = (dataArr) => {
fs.stat(filePath, (err, stats) => {
  if (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist, create a new JSON object
      const jsonData = {
        data: dataArr
      };
      const updatedData = JSON.stringify(jsonData, null, 2);

      // Write the JSON string to the file
      fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          return;
        }

      });
    } else {
      console.error('Error reading file:', err);
    }
    return;
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Step 3: Parse the JSON data
    let jsonData = JSON.parse(data);

    // Step 4: Modify the JavaScript object
    // Append or update properties as needed
    jsonData.data = jsonData.data.concat(dataArr)

    // Step 5: Convert the JavaScript object to JSON string
    let updatedData = JSON.stringify(jsonData, null, 2);

    // Step 6: Write the JSON string back to the file
    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }

      console.log('Data appended to JSON file successfully.');
    });
  });
});
}

export default storeData;