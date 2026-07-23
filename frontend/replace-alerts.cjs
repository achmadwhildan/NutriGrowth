const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findFiles('./src', /\.(tsx|ts|js|jsx)$/);
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('alert(')) {
    let changed = false;
    content = content.replace(/alert\((.*?)\);?/g, (match, p1) => {
      changed = true;
      const lower = p1.toLowerCase();
      if (lower.includes('berhasil') || lower.includes('selamat')) {
        return 'toast.success(' + p1 + ');';
      } else {
        return 'toast.error(' + p1 + ');';
      }
    });
    
    if (changed) {
      if (!content.includes('react-hot-toast')) {
        content = "import toast from 'react-hot-toast';\n" + content;
      }
      fs.writeFileSync(file, content, 'utf8');
      modifiedCount++;
      console.log('Updated', file);
    }
  }
}
console.log('Modified', modifiedCount, 'files.');
