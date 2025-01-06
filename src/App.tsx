import React, { useEffect, useState } from 'react';
import { IKickstarterProject } from './type';

const App: React.FC = () => {
  const [projects, setProjects] = useState<IKickstarterProject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const recordsPerPage = 5;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json'
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProjects(data);
        setTotalPages(Math.ceil(data.length / recordsPerPage));
        setError(null);
      } catch (error:any) {
        setProjects([]);
        setTotalPages(1);
        setError(error.message || 'An unknown error occurred.');

      }
    };
    fetchProjects();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return projects.slice(startIndex, startIndex + recordsPerPage);
  };

  return (
    <div className="container">
      <h1 className="title" >Kickstarter Project</h1>
      {error ? (
        <div className="error-container">
          <h2>{error}</h2>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : (
     <>
      <table className="projects-table">
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>S.No.</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>
              Percentage Funded
            </th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>
              Amount Pledged
            </th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedData().map((project) => (
            <tr key={project["s.no"]}>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                {project["s.no"]}
              </td>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                {project['percentage.funded']}
              </td>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                {project['amt.pledged']}
              </td>
            </tr>
          ))}
          {Array.from({ length: recordsPerPage - getPaginatedData().length }).map((_, index) => (
            <tr key={`empty-${index}`} className="empty-row">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            cursor: 'pointer',
            backgroundColor: currentPage === 1 ? '#ccc' : '#712b84',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            cursor: 'pointer',
            backgroundColor: currentPage === totalPages ? '#ccc' : '#712b84',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Next
        </button>
      </div></>)}
    </div>
  );
};

export default App;
