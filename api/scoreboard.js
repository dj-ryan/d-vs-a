exports.handler = async function(event) {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPOSITORY || '';
  const [owner, repo] = repoFull.split('/');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/scores.json`;

  if (!token || !owner || !repo) {
    return { statusCode: 500, body: 'Missing configuration' };
  }

  if (event.httpMethod === 'GET') {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const data = await res.json();
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return { statusCode: 200, body: content };
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const getRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const fileData = await getRes.json();
    const content = Buffer.from(JSON.stringify(body), 'utf8').toString('base64');
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update scores',
        content,
        sha: fileData.sha
      })
    });
    const result = await putRes.json();
    return { statusCode: 200, body: JSON.stringify(result) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
