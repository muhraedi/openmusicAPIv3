const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapDBToModelPlaylist } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(songsService) {
    this._pool = new Pool();
    this._songsService = songsService;
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `playlistSong-${nanoid(16)}`;

    await this._songsService.getSongById(songId);

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Playlist song gagal ditambahkan');

    return result.rows[0].id;
  }

  async getPlaylistSongById(id) {
    const query = {
      text: `
      SELECT playlist_songs.*, songs.title, songs.performer, playlists.*, users.username
      FROM playlist_songs
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
      LEFT JOIN playlists ON playlists.id = playlist_songs.playlist_id
      LEFT JOIN users on users.id = playlists.owner
      WHERE playlist_songs.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

    const playlist = mapDBToModelPlaylist(result.rows);

    return playlist;
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Playlist song gagal dihapus');
  }
}

module.exports = PlaylistSongsService;
