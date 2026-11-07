from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import get_user_id_from_token
from app.database import get_db
from app.models import User

bearer_scheme = HTTPBearer(auto_error=False)
DatabaseSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ],
    db: DatabaseSession,
) -> User:
    user_id = (
        get_user_id_from_token(credentials.credentials)
        if credentials is not None
        else None
    )
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session is invalid or has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account could not be found. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
