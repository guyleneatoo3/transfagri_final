If you see "Data truncated for column 'role'" when creating users, the database column `utilisateur.role` is too small to store role strings.

Quick fix (run in MySQL client):

ALTER TABLE utilisateur MODIFY role VARCHAR(20);

This repo uses `@Enumerated(EnumType.STRING)` and `@Column(length = 20)` on `Utilisateur.role`. If your existing DB column is shorter (CHAR(4) or ENUM), run the ALTER above and restart the app.

Also note: Role JSON serialization was adjusted to store plain enum names (e.g. `ADMIN`) instead of `ROLE_ADMIN` to reduce length.
