const mapDBToModel = ({
  id,
  name,
  year,
  title,
  genre,
  performer,
  duration,
  album_id,
  username,
  owner,
  playlist_id,
  song_id,
}) => ({
  id,
  name,
  year,
  title,
  genre,
  performer,
  duration,
  albumId: album_id,
  username,
  owner,
  playlistId: playlist_id,
  songId: song_id,
});

const mapDBToModelPlaylist = (dataFromDB) => {
  const playlist = {
    id: dataFromDB[0].id,
    name: dataFromDB[0].name,
    username: dataFromDB[0].username,
    songs: [],
  };

  dataFromDB.forEach((el) => {
    const song = {
      id: el.song_id,
      title: el.title,
      performer: el.performer,
    };

    playlist.songs.push(song);
  });

  return playlist;
};

const mapDBToModelActivity = (dataFromDB) => {
  const data = {
    playlistId: dataFromDB[0].id,
    activities: [],
  };

  dataFromDB.forEach((el) => {
    const activity = {
      username: el.username,
      title: el.title,
      action: el.action,
      time: el.time,
    };

    data.activities.push(activity);
  });
  return data;
};

const filterTitleByParam = (song, title) => (
  song.title.toLowerCase().includes(title)
);
const filterPerformerByParam = (song, performer) => (
  song.performer.toLowerCase().includes(performer)
);

module.exports = {
  mapDBToModel,
  mapDBToModelPlaylist,
  mapDBToModelActivity,
  filterTitleByParam,
  filterPerformerByParam,
};
