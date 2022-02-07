FROM madnificent/ember:3.17.0 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN ember build -prod

FROM semtech/ember-proxy-service:1.5.1
ENV EMBER_VO_HEADER_WIDGET_URL=""
ENV EMBER_VO_FOOTER_WIDGET_URL=""

ENV STATIC_FOLDERS_REGEX "^/(assets|fonts|files|ember-pdfjs-wrapper)/"

COPY --from=builder /app/dist /app
