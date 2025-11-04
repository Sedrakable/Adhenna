export default `
body {
  font-family: 'Josefin Sans', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff1eb;
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
  color: #853d57;
  margin: 0;
  margin-bottom: 10px;
}

h1 {
  font-size: 28px;
  margin-bottom: 15px;
}

h2 {
  font-size: 20px;
  margin-top: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #dcb2c1;
  padding: 12px;
  text-align: left;
}

th {
  background-color: rgba(220, 178, 194, 0.3);
  color: #572839;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #fff1eb;
}

.total {
  font-weight: bold;
  background-color: rgba(133, 61, 87, 0.1);
}

.details-section {
  background-color: rgba(220, 178, 194, 0.3);
  color: #572839;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.detail-item {
  margin: 12px 0;
}

.detail-label {
  font-weight: bold;
  color: #853d57;
  display: block;
  margin-bottom: 5px;
}

p {
  margin: 0 0 10px;
  color: #2a131c;
}

a {
  color: #853d57;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.signature {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #dcb2c1;
  color: #572839;
  font-weight: bold;
}
`;
