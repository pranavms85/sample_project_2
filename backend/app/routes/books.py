from fastapi import APIRouter, HTTPException, Response, status
from sqlalchemy import select

from app.dependencies import CurrentUser, DatabaseSession
from app.models import Book
from app.schemas import BookCreate, BookRead

router = APIRouter(prefix="/api/books", tags=["books"])


@router.get("", response_model=list[BookRead])
def list_books(user: CurrentUser, db: DatabaseSession) -> list[Book]:
    statement = (
        select(Book)
        .where(Book.owner_id == user.id)
        .order_by(Book.created_at.desc(), Book.id.desc())
    )
    return list(db.scalars(statement).all())


@router.post("", response_model=BookRead, status_code=status.HTTP_201_CREATED)
def create_book(payload: BookCreate, user: CurrentUser, db: DatabaseSession) -> Book:
    book = Book(
        title=payload.title.strip(),
        author=payload.author.strip(),
        genre=payload.genre.strip(),
        rating=payload.rating,
        review=payload.review.strip(),
        owner_id=user.id,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.put("/{book_id}", response_model=BookRead)
def update_book(
    book_id: int,
    payload: BookCreate,
    user: CurrentUser,
    db: DatabaseSession,
) -> Book:
    book = db.scalar(
        select(Book).where(Book.id == book_id, Book.owner_id == user.id)
    )
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found in your catalogue.")

    book.title = payload.title.strip()
    book.author = payload.author.strip()
    book.genre = payload.genre.strip()
    book.rating = payload.rating
    book.review = payload.review.strip()
    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, user: CurrentUser, db: DatabaseSession) -> Response:
    book = db.scalar(
        select(Book).where(Book.id == book_id, Book.owner_id == user.id)
    )
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found in your catalogue.")
    db.delete(book)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
