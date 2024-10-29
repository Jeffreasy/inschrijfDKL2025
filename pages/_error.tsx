import { NextPage } from 'next';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          {statusCode ? `${statusCode}` : 'Er is een fout opgetreden'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {statusCode
            ? 'Er is een fout opgetreden op de server'
            : 'Er is een fout opgetreden in de client'}
        </p>
        <a
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Terug naar de homepage
        </a>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;