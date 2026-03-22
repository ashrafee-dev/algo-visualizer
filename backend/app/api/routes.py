from fastapi import APIRouter, HTTPException

from app.algorithms.base import NotImplementedAlgorithmError
from app.execution.runner import AlgorithmExecutionError
from app.schemas.contracts import AlgorithmDetail, AlgorithmSummary, RunCustomRequest, RunRequest, RunResponse
from app.services.algorithms_service import algorithms_service

router = APIRouter()


@router.get('/algorithms', response_model=list[AlgorithmSummary])
def list_algorithms() -> list[AlgorithmSummary]:
    return algorithms_service.list_algorithms()


@router.get('/algorithms/{algorithm_id}', response_model=AlgorithmDetail)
def get_algorithm(algorithm_id: str) -> AlgorithmDetail:
    try:
        return algorithms_service.get_algorithm(algorithm_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail='Algorithm not found') from exc


@router.post('/algorithms/{algorithm_id}/run', response_model=RunResponse)
def run_algorithm(algorithm_id: str, request: RunRequest) -> RunResponse:
    try:
        return algorithms_service.run_algorithm(algorithm_id, request.input_data)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail='Algorithm not found') from exc
    except NotImplementedAlgorithmError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    except AlgorithmExecutionError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post('/algorithms/{algorithm_id}/run-custom', response_model=RunResponse)
def run_custom_algorithm(algorithm_id: str, request: RunCustomRequest) -> RunResponse:
    try:
        return algorithms_service.run_custom_algorithm(algorithm_id, request.code, request.input_data)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail='Algorithm not found') from exc
    except NotImplementedAlgorithmError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    except AlgorithmExecutionError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get('/categories', response_model=list[str])
def list_categories() -> list[str]:
    return algorithms_service.list_categories()
