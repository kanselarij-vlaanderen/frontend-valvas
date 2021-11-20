FROM madnificent/ember:3.17.0 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN ember build -prod

FROM semtech/ember-proxy-service:1.5.1
ENV EMBER_VO_HEADER="https://tni.widgets.burgerprofiel.dev-vlaanderen.be/api/v1/widget/3bcc4b26-e216-489c-8f11-cd9299f08199"
ENV EMBER_VO_FOOTER="https://tni.widgets.burgerprofiel.dev-vlaanderen.be/api/v1/widget/3bcc4b26-e216-489c-8f11-cd9299f08199"

ENV STATIC_FOLDERS_REGEX "^/(assets|fonts|files|ember-pdfjs-wrapper)/"

COPY --from=builder /app/dist /app
