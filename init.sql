create table whiskys (
  id serial primary key,
  type varchar(30) not null,
  value int not null,
  name varchar(30) not null
);

insert into whiskys(type, value, name) values ('Japanese', 300, 'Suntory');
