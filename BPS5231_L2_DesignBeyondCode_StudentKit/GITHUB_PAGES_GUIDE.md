# GITHUB PAGES - QUICK GUIDE

## Repository
Create:

`YOUR-USERNAME.github.io`

## Minimal published site structure

```text
/
├── index.html
├── style.css
├── script.js        # optional
└── assets/
```

## Publish
1. Commit and push your website files to GitHub.
2. Open the repository on GitHub.
3. Go to **Settings**.
4. Open **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the publishing branch, normally `main`, and the root folder.
7. Save.
8. Visit:

`https://YOUR-USERNAME.github.io`

Publishing may take a few minutes.

## Common problems

### 404
Check:
- repository spelling;
- `index.html` exists;
- Pages is deploying the correct branch.

### CSS not loading
Use relative paths:

```html
<link rel="stylesheet" href="style.css">
```

### Images not loading
Use repository-relative paths:

```html
<img src="assets/project-1.jpg" alt="Project 1">
```

File names are case-sensitive when published.
