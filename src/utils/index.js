/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  name,
  year,
  title,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  name,
  year,
  title,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const filterTitleByParam = (song, title) => (
  song.title.toLowerCase().includes(title)
);
const filterPerformerByParam = (song, performer) => (
  song.performer.toLowerCase().includes(performer)
);

module.exports = {
  mapDBToModel,
  filterTitleByParam,
  filterPerformerByParam,
};
