import { useState } from "react";

const BASE_URL =
  "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

function JobItem({ job, candidate }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

    function isValidGithubUrl(url) {
  return url.startsWith("https://github.com/");
}


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
            applicationId: candidate.applicationId,
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
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
    }}
  >
    <h3 style={{ marginBottom: "10px" }}>{job.title}</h3>

    <input
      type="text"
      placeholder="https://github.com/tu-usuario/tu-repo"
      value={repoUrl}
      onChange={(e) => setRepoUrl(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
    />

    {repoUrl && !isValidGithubUrl(repoUrl) && (
      <p style={{ color: "orange", fontSize: "14px" }}>
        La URL debe comenzar con https://github.com/
      </p>
    )}

    <button
      onClick={handleSubmit}
      disabled={loading || !isValidGithubUrl(repoUrl)}
      style={{
        padding: "10px 15px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
        cursor: "pointer"
      }}
    >
      {loading ? "Enviando..." : "Submit"}
    </button>

    {success && (
      <p style={{ color: "green", marginTop: "10px" }}>
        Postulación enviada correctamente ✅
      </p>
    )}

    {error && (
      <p style={{ color: "red", marginTop: "10px" }}>
        {error}
      </p>
    )}
  </div>
);
}

export default JobItem;
