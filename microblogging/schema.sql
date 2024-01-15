

create table user (
  userid int auto_increment primary key,
  username text not null unique,
  password text not null
);

create table submission (
  id int auto_increment primary key,
  user_id int not null,
  post text not null,
  startTime timestamp default current_timestamp,
  like_count int not null default 0,
  username text not null,
  foreign key (user_id) references user(userId)
);




