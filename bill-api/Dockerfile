FROM python:3.12-slim

WORKDIR /srv/bill-api

# Install deps first (optional optimization)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose port if you like (informational)
EXPOSE 5040

CMD ["python", "app.py"]