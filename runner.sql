


/*CREATE TABLE user_data(
 id SERIAL PRIMARY KEY,
 phone_number VARCHAR(20),
 email TEXT UNIQUE NOT NULL CHECK(email=Lower(email)),
 password TEXT NOT NULL,
 acc_date TIMESTAMPTZ(0) NOT NULL DEFAULT NOW()
)
*/
truncate table user_data restart identity