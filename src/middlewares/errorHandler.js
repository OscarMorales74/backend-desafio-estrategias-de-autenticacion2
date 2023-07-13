export const errorHandler = (error, req, res, next) => {
    console.log( `Error en errorHandler: ${error.message}` )
    const status = error.status || 400
    res.status(status).send(error.message)
}