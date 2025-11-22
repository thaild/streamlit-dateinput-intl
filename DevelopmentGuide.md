# Development Guide

This guide will help you set up and develop the `streamlit-dateinput-intl` component locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python >= 3.10**
- **Node.js >= 24** (LTS recommended)
- **UV** package manager - Install from [https://github.com/astral-sh/uv](https://github.com/astral-sh/uv)
- **Git** (for version control)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd streamlit-dateinput-intl
```

### 2. Create Virtual Environment

Create and activate a virtual environment using UV:

```bash
# Create virtual environment
uv venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate

# On Windows:
.venv\Scripts\activate
```

### 3. Install Python Dependencies

Install the component and its dependencies in editable mode:

```bash
uv pip install -e .
```

For development dependencies (optional, for testing):

```bash
uv pip install -e ".[devel]"
```

### 4. Install Frontend Dependencies

Navigate to the frontend directory and install Node.js dependencies:

```bash
cd streamlit_dateinput_intl/frontend
npm install
cd ../..
```

### 5. Build Frontend Assets

Build the frontend for the first time:

```bash
cd streamlit_dateinput_intl/frontend
npm run build
cd ../..
```

## Development Workflow

### Running the Development Server

1. **Start the frontend in watch mode** (rebuilds automatically on changes):

   ```bash
   cd streamlit_dateinput_intl/frontend
   npm run dev
   ```

   Keep this terminal running. The frontend will automatically rebuild when you make changes to TypeScript/React files.

2. **In a new terminal**, run the Streamlit app:

   ```bash
   # Make sure you're in the project root and virtual environment is activated
   streamlit run example.py
   ```

   The app will open in your browser at `http://localhost:8501`

### Development Tips

- **Frontend Changes**: When you modify files in `streamlit_dateinput_intl/frontend/src/`, the watch mode will automatically rebuild. You may need to refresh the Streamlit app to see changes.

- **Python Changes**: Since the package is installed in editable mode (`-e`), Python changes are picked up automatically. You may need to refresh the Streamlit app.

- **Hot Reload**: Streamlit has hot reload enabled by default. When you save changes, the app will automatically reload.

## Project Structure

```
streamlit-dateinput-intl/
├── streamlit_dateinput_intl/          # Main package directory
│   ├── __init__.py                    # Python component interface
│   ├── frontend/                      # Frontend React/TypeScript code
│   │   ├── src/
│   │   │   ├── index.tsx             # Component root
│   │   │   ├── DateInput.tsx          # Main DateInput component
│   │   │   └── useIntlLocale.tsx      # Locale utilities
│   │   ├── package.json               # Node.js dependencies
│   │   └── vite.config.ts             # Vite build configuration
│   └── pyproject.toml                 # Package metadata
├── example.py                         # Example Streamlit app
├── pyproject.toml                     # Project configuration
└── README.md                          # Project documentation
```

## Building for Production

### Build Frontend

From the frontend directory:

```bash
cd streamlit_dateinput_intl/frontend
npm run build
cd ../..
```

This will:
- Run type checking
- Clean the build directory
- Build production-optimized assets in `streamlit_dateinput_intl/frontend/build/`

### Build Python Wheel

From the project root:

```bash
uv build
```

This creates a wheel file in the `dist/` directory that includes:
- Python package code
- Compiled frontend assets from `frontend/build/`

## Publishing to PyPI

### Prerequisites

Before publishing, ensure you have:

1. **PyPI Account**: Create an account at [https://pypi.org/account/register/](https://pypi.org/account/register/)
2. **API Token**: Generate an API token at [https://pypi.org/manage/account/](https://pypi.org/manage/account/)
   - Go to "API tokens" section
   - Create a new token with appropriate scope (project scope recommended)
   - Save the token securely (format: `pypi-...`)

### Pre-Publishing Checklist

Before publishing, make sure:

- [ ] Version number is updated in `pyproject.toml`
- [ ] Frontend is built (`npm run build` in `frontend/` directory)
- [ ] All tests pass
- [ ] README.md is up to date
- [ ] LICENSE file exists
- [ ] Package builds successfully (`uv build`)

### Step 1: Update Version Number

Update the version in `pyproject.toml`:

```toml
[project]
version = "0.0.2"  # Increment as needed (major.minor.patch)
```

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### Step 2: Build Frontend Assets

Ensure the frontend is built with production optimizations:

```bash
cd streamlit_dateinput_intl/frontend
npm run build
cd ../..
```

### Step 3: Build Distribution Packages

Build both wheel and source distribution:

```bash
uv build
```

This creates files in the `dist/` directory:
- `streamlit_dateinput_intl-<version>-py3-none-any.whl` (wheel)
- `streamlit_dateinput_intl-<version>.tar.gz` (source distribution)

### Step 4: Test the Build Locally (Optional)

Test installing the built package locally:

```bash
# Create a test virtual environment
uv venv test_env
source test_env/bin/activate  # On Windows: test_env\Scripts\activate

# Install from the built wheel
uv pip install dist/streamlit_dateinput_intl-<version>-py3-none-any.whl

# Test the package
python -c "from streamlit_dateinput_intl import streamlit_dateinput_intl; print('OK')"

# Cleanup
deactivate
rm -rf test_env
```

### Step 5: Test on TestPyPI (Recommended)

Test your package on TestPyPI before publishing to production:

1. **Create TestPyPI account** at [https://test.pypi.org/account/register/](https://test.pypi.org/account/register/)
2. **Generate TestPyPI API token** at [https://test.pypi.org/manage/account/](https://test.pypi.org/manage/account/)
3. **Upload to TestPyPI**:

```bash
# Install twine if not already installed
uv pip install twine

# Upload to TestPyPI
twine upload dist/*
```

You'll be prompted for:
- Username: `__token__`
- Password: Your TestPyPI API token (starts with `pypi-...`)

4. **Test installation from TestPyPI**:

```bash
uv pip install --index-url https://test.pypi.org/simple/ streamlit-dateinput-intl
```

### Step 6: Publish to PyPI

Once tested, publish to production PyPI:

```bash
twine upload dist/*
```

You'll be prompted for:
- Username: `__token__`
- Password: Your PyPI API token (starts with `pypi-...`)

**Note**: Once published, you cannot delete or modify a version. You can only upload new versions.

### Step 7: Verify Publication

Verify your package is available:

1. Check on PyPI: `https://pypi.org/project/streamlit-dateinput-intl/`
2. Test installation:

```bash
uv pip install streamlit-dateinput-intl
```

### Alternative: Using Environment Variables

To avoid entering credentials each time, set environment variables:

```bash
# For TestPyPI
export TWINE_USERNAME=__token__
export TWINE_PASSWORD=pypi-your-test-token-here

# For production PyPI
export TWINE_USERNAME=__token__
export TWINE_PASSWORD=pypi-your-production-token-here
```

Then upload:

```bash
twine upload dist/*
```

### Troubleshooting Publishing

**Error: "File already exists"**
- The version already exists on PyPI
- Increment the version number in `pyproject.toml` and rebuild

**Error: "Invalid credentials"**
- Verify your API token is correct
- Ensure you're using `__token__` as username
- Check token hasn't expired

**Error: "Package not found"**
- Ensure frontend is built: `cd streamlit_dateinput_intl/frontend && npm run build`
- Rebuild the package: `uv build`

**Error: "Missing required files"**
- Ensure `LICENSE` file exists
- Check `README.md` is present
- Verify `pyproject.toml` is correct

## Common Development Tasks

### Type Checking

Check TypeScript types without building:

```bash
cd streamlit_dateinput_intl/frontend
npm run typecheck
```

### Code Formatting

Format frontend code with Prettier:

```bash
cd streamlit_dateinput_intl/frontend
npm run format
```

### Clean Build Artifacts

Remove build artifacts:

```bash
cd streamlit_dateinput_intl/frontend
npm run clean
```

### Reinstall Dependencies

If you encounter dependency issues:

**Python:**
```bash
uv pip install -e . --force-reinstall
```

**Frontend:**
```bash
cd streamlit_dateinput_intl/frontend
rm -rf node_modules package-lock.json
npm install
```

## Testing

### Run Tests (if configured)

```bash
# Run Python tests
pytest

# Run frontend tests (if configured)
cd streamlit_dateinput_intl/frontend
npm test
```

## Troubleshooting

### Frontend Build Errors

- **Type errors**: Run `npm run typecheck` to see detailed TypeScript errors
- **Build fails**: Try cleaning and rebuilding: `npm run clean && npm run build`
- **Module not found**: Reinstall dependencies: `rm -rf node_modules && npm install`

### Python Import Errors

- **Module not found**: Ensure virtual environment is activated and package is installed: `uv pip install -e .`
- **Component not loading**: Make sure frontend is built: `cd streamlit_dateinput_intl/frontend && npm run build`

### Streamlit Not Showing Changes

- **Frontend changes**: Ensure `npm run dev` is running, then refresh the browser
- **Python changes**: Refresh the Streamlit app (Streamlit auto-reloads on save)
- **No changes visible**: Clear browser cache or do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Development Best Practices

1. **Keep frontend watch mode running** during development for automatic rebuilds
2. **Test in the example app** (`example.py`) before committing changes
3. **Run type checking** before committing: `npm run typecheck`
4. **Format code** before committing: `npm run format`
5. **Build production assets** before creating a release: `npm run build && uv build`

## Next Steps

- Review the component API in `streamlit_dateinput_intl/__init__.py`
- Check the example usage in `example.py`
- Explore the frontend component in `streamlit_dateinput_intl/frontend/src/DateInput.tsx`

## Getting Help

- Check the [README.md](README.md) for usage examples
- Review Streamlit component documentation: [https://docs.streamlit.io/develop/api-reference/components](https://docs.streamlit.io/develop/api-reference/components)
- Check BaseUI Datepicker documentation: [https://baseweb.design/components/datepicker](https://baseweb.design/components/datepicker)

