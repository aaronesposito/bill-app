# Use an official Python runtime
FROM python:3.11

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container
COPY bill-api/ .

# Install dependencies globally (no venv)
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Flask will run on
EXPOSE 5040

# Start the application using Waitress (production) or Flask (development)
CMD ["waitress-serve", "--host=0.0.0.0", "--port=5040", "app:app"]

# Uncomment for development mode
# CMD ["flask", "run", "--host=0.0.0.0", "--port=5040", "--debug"]