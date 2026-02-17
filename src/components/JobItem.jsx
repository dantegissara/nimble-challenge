import { useState } from "react";

const BASE_URL =
  "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

function JobItem({ job, candidate }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    if (!repoUrl) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `${BASE_URL}/api/candidate/apply-to-job`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            uuid: candidate.uuid,
            jobId: job.id,
            candidateId: candidate.candidateId,
            repoUrl: repoUrl
          })
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar la postulación");
      }

      const data = await response.json();

      if (data.ok) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px"
      }}
    >
      <h3>{job.title}</h3>

      <input
        type="text"
        placeholder="https://github.com/tu-usuario/tu-repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px"
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !repoUrl}
      >
        {loading ? "Enviando..." : "Submit"}
      </button>

      {success && (
        <p style={{ color: "green" }}>
          Postulación enviada correctamente ✅
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default JobItem;
