import { useEffect, useState } from "react";
import JobItem from "./components/JobItem";


const BASE_URL =
  "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

function App() {
  const [jobs, setJobs] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = "dantegissara@outlook.es"; 

  useEffect(() => {
    async function fetchData() {
      try {
        // 1️⃣ Traer candidato
        const candidateResponse = await fetch(
          `${BASE_URL}/api/candidate/get-by-email?email=${email}`
        );

        if (!candidateResponse.ok) {
          throw new Error("No se pudo obtener el candidato");
        }

        const candidateData = await candidateResponse.json();
        setCandidate(candidateData);

        // 2️⃣ Traer jobs
        const jobsResponse = await fetch(
          `${BASE_URL}/api/jobs/get-list`
        );

        if (!jobsResponse.ok) {
          throw new Error("No se pudieron obtener los jobs");
        }

        const jobsData = await jobsResponse.json();
        setJobs(jobsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Nimble Gravity Challenge</h1>

      <h2>Datos del candidato:</h2>
      <p>
        {candidate?.firstName} {candidate?.lastName}

      </p>

      <h2>Posiciones abiertas:</h2>
      <ul>
        {jobs.map((job) => (
                <JobItem
          key={job.id}
          job={job}
          candidate={candidate}
        />
        ))}
      </ul>
    </div>
  );
}

export default App;
