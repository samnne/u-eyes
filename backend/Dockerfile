FROM python:3.13-slim-trixie
COPY --from=ghcr.io/astral-sh/uv:0.9.21 /uv /uvx /bin/


COPY . /app

WORKDIR /app

ENV UV_NO_DEV=1


RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]