# Use a lightweight Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the FastAPI port
EXPOSE 8000

# Run the FastAPI application
CMD ["uvicorn", "app-fastapi:app", "--host", "0.0.0.0", "--port", "8000"]
