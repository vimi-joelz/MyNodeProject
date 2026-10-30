CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE user_table(
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 name TEXT,
 carrier VARCHAR(10),
 balance NUMERIC  NOT NULL DEFAULT 0.00,
 date_time TIMESTAMPTZ(0) DEFAULT NOW()
);

CREATE TABLE transaction_history (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 user_id UUID REFERENCES user_table(id),
 transaction_status TEXT CHECK(transaction_status IN('DEPOSIT','RECHARGE','WITHDRAW'))NOT NULL DEFAULT 'DEPOSIT',
 transactions NUMERIC NOT NULL DEFAULT 0.00,
 time_transact TIMESTAMPTZ(0) DEFAULT NOW()
);

/*drop table transaction_history;
drop table user_table CASCADE;*/