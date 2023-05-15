/* eslint-disable no-underscore-dangle */

const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._service.writeFile(cover, cover.hapi);
    const url = `${filename}`;

    await this._albumsService.editAlbumCoverById(albumId, url);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
