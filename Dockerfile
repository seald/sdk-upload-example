FROM node:latest
RUN mkdir /app/
RUN mkdir /app/frontend
COPY frontend/package*.json /app/frontend
WORKDIR /app/frontend/
RUN npm ci
COPY frontend/ /app/frontend
ARG SEALD_APP_ID
ENV REACT_APP_SEALD_APP_ID=$SEALD_APP_ID
RUN npm run build

FROM python:latest
RUN mkdir /app/
RUN mkdir /app/backend
COPY backend/requirements.txt /app/backend
WORKDIR /app/backend/
RUN pip install -r requirements.txt

RUN useradd -ms /bin/bash django_user

COPY backend/ /app/backend
COPY --from=0 /app/frontend/build/ /app/static/
RUN mkdir /app/data
RUN mkdir /app/encrypted_upload
RUN chown -R django_user /app

USER django_user
VOLUME /app/data/
VOLUME /app/backend/db/
EXPOSE 8000

CMD ["sh", "entrypoint.sh"]
