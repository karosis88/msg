from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy import DateTime
from database import Base
from datetime import datetime
from sqlalchemy import ForeignKey
from enum import Enum
from sqlalchemy import Enum as En


class FRIEND_STATE(Enum):
    Requested = "Requested"
    Approved = "Approved"
    Blocked = "Blocked"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)
    last_login = Column(DateTime, default=datetime.now())
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())


class Friends(Base):
    __tablename__ = "friends"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(Integer, ForeignKey("users.id"))
    requested_user = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.now())
    state = Column(En(FRIEND_STATE))

    __table_args__ = (UniqueConstraint("user", "requested_user", name="unfriend"),)
