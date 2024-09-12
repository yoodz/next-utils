import React, { useState } from 'react';
import ExifReader from 'exifreader';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

const getBase64 = (file): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const MAX_FILE_SIZE = 30;
const ExifReaderWrap = () => {
  const [imageData, setImageData] = useState(null);
  const [exifData, setExifData] = useState(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    async onChange(info) {
      const { status, originFileObj } = info.file;
  
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        setImageData(originFileObj)
        const tags = await ExifReader.load(originFileObj);
        console.log(status, tags, 'index-12')
    
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: async (file) => {
      const size = file.size / 1024 / 1024
      if (size > MAX_FILE_SIZE) {
        message.error("文件大小最大支持5M");
        return false;
      }
      const base64 = await getBase64(file)
      setFileList([...fileList, base64]);
      console.log(fileList, base64, 'index-37')
      return false;
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  return (
    <div>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽上传</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other
          banned files.
        </p>
      </Dragger>
      {/* {imageData && <img src={imageData} alt="Selected" style={{ maxWidth: '500px' }} />} */}

      {fileList.map((item) => <img src={item} alt="Selected" style={{ maxWidth: '500px' }} />)}

      {exifData && (
        <div>
          <h3>EXIF Data:</h3>
          <pre>{JSON.stringify(exifData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ExifReaderWrap;