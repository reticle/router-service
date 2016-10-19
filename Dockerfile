FROM node:6.9.0

RUN useradd --user-group --shell /bin/false app && \
    mkdir /app

WORKDIR /app

# Copy package.json.
COPY package.json /app

# Install dependencies.
RUN npm install --production --silent --progress=false && \
    npm cache clean --silent --progress=false

# Copy the full application.
COPY . /app

# Transpile TypeScript into ES2015 and change permissions.
#RUN ./node_modules/.bin/tsc -p . && \
#    chown -R app:app /app
RUN chown -R app:app /app

# Set default user
USER app

# Start the application.
CMD ["node", "dist/lib/main.js"]
