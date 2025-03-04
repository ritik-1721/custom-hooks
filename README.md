# useFetch Hook

A custom React hook for fetching data with support for authentication, request cancellation, and automatic fetching.

## Features
- Fetch data from a given URL.
- Supports authentication tokens stored in local storage.
- Auto-fetching on component mount.
- Handles request cancellation to avoid race conditions.
- Logout on unauthorized response (401).

---

## Installation

You can download and use the `useFetch` hook using the following command:

```sh
npx shx curl -o src/hooks/useFetch.js "https://raw.githubusercontent.com/ritik-1721/custom-hooks/main/hooks/useFetch.js"
```

Simply copy the `useFetch.js` file into your project and import it where needed.

```javascript
import useFetch from "./useFetch";
```

---

## Usage

### 1. Fetching a List

To fetch a list of items:

```javascript
import React from "react";
import useFetch from "./useFetch";

const ItemList = () => {
  const { data, loading, error } = useFetch({ URL: "https://api.example.com/items" });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data && data.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

export default ItemList;
```

### 2. Fetching a Paginated List

If the API supports pagination, you can modify the URL dynamically:

```javascript
import React, { useState } from "react";
import useFetch from "./useFetch";

const PaginatedList = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error, fetchData } = useFetch({ URL: `https://api.example.com/items?page=${page}` });

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {data && data.map((item) => <li key={item.id}>{item.name}</li>)}
      </ul>
      <button onClick={prevPage} disabled={page === 1}>Previous</button>
      <button onClick={nextPage}>Next</button>
    </div>
  );
};

export default PaginatedList;
```

### 3. Submitting a Form

You can use `fetchData` to send a POST request for form submissions:

```javascript
import React, { useState } from "react";
import useFetch from "./useFetch";

const SubmitForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const { loading, error, fetchData } = useFetch({ URL: "https://api.example.com/submit", autoFetch: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData({
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <button type="submit" disabled={loading}>Submit</button>
      {error && <p>Error: {error}</p>}
    </form>
  );
};

export default SubmitForm;
```

---

## API Reference

### `useFetch({ URL, options, autoFetch, systemToken })`

| Parameter    | Type    | Default | Description |
|-------------|--------|---------|-------------|
| `URL`       | string | -       | The API endpoint to fetch data from. |
| `options`   | object | `{}`    | Fetch request options (method, headers, etc.). |
| `autoFetch` | bool   | `true`  | Whether to fetch data automatically on mount. |
| `systemToken` | bool   | `false` | Use a system-wide authentication token. |

### Return Values

| Name       | Type       | Description |
|------------|-----------|-------------|
| `data`     | any       | The fetched data. |
| `loading`  | boolean   | Indicates if the request is in progress. |
| `error`    | string    | Stores any error messages. |
| `fetchData` | function | Function to manually trigger the fetch request. |

---

## Notes
- If the API returns a 401 response, the user is automatically logged out and redirected to the login page.
- Requests are automatically canceled when a new one is made to prevent race conditions.
- `fetchData` can be used to re-fetch data or submit form data.

---

## License
This hook is open-source and free to use in any project.

---

