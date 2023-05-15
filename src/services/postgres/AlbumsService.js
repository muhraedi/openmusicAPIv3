/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Album gagal ditambahkan');

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Album tidak ditemukan');

    // check coverAlbum
    if (result.rows[0].coverUrl !== null) {
      result.rows[0].coverUrl = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${result.rows[0].coverUrl}`;
    }

    // check if there are songs in the album
    const querySongs = {
      text: 'SELECT s.id, s.title, s.performer FROM songs s LEFT JOIN albums a ON s.album_id = a.id WHERE s.album_id = $1;',
      values: [id],
    };
    const resultSongsInAlbum = await this._pool.query(querySongs);

    // there are no songs in the album
    if (!resultSongsInAlbum.rowCount) {
      return { ...result.rows[0], songs: [] };
    }

    // there are songs in the album
    return { ...result.rows[0], songs: resultSongsInAlbum.rows };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
  }

  async editAlbumCoverById(id, url) {
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1 WHERE id = $2 RETURNING id',
      values: [url, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
  }
}

module.exports = AlbumsService;
