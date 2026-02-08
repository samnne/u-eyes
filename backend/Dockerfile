FROM python:3.14-slim-trixie
COPY --from=ghcr.io/astral-sh/uv:0.9.21 /uv /uvx /bin/


COPY . /app

WORKDIR /app

ENV UV_NO_DEV=1


RUN uv sync --locked

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]