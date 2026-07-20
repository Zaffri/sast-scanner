FROM dxflrs/garage:v2.3.0 AS garage

FROM alpine:3.21

COPY --from=garage /garage /garage

# allow setup of entry point script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]