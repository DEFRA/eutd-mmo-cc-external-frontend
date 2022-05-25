import App from './App';
import base from './routes/Base';
import catchCertificate from './routes/CatchCertificate';
import processingStatement from './routes/ProcessingStatement';
import storageDocument from './routes/StorageDocument';


export default [
  {
    ...App,
    routes: [
      ...catchCertificate,
      ...processingStatement,
      ...storageDocument,
      ...base
    ]
  }
];
