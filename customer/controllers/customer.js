const { Customer, Media, Address } = require("../model");
const { validationResult } = require("express-validator");
const errors = require("../util/errors");
const getPaiganation = require("../util/paiganation");

const getAllCustomers = async (req, res) => {
    const { limit, offset } = getPaiganation(req.query.page, req.query.limit);

    const cusCount = await Customer.count();
    const customers = await Customer.findAll({ limit: limit, offset: offset, include: [Media, Address] });

    res.status(200).json({ total: cusCount, nodes: customers });
};

const getCustomerByID = async (req, res) => {
    const id = req.params.id;
    if (!id || id === 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const customer = await Customer.findOne({ where: { id: id }, include: [Media, Address] });
    if (!customer) {
        res.status(404).send(errors.notFound);
        return;
    }

    res.status(200).json(customer);
};

const createCustomer = async (req, res) => {
    const user = req.headers.user;
    if (user !== req.body.id) {
        res.status(400).json({
            ...errors.badRequest,
            message: "customer.id in body should be same as logged in user",
        });
        return;
    }

    const err = validationResult(req);
    if (!err.isEmpty()) {
        console.error(err);
        res.status(400).json({ status: 400, message: err.array() });
        return;
    }

    const customer = req.body;
    try {
        const createdCustomer = await Customer.create(customer);
        const result = await Customer.findOne({ where: { id: createdCustomer.id }, include: Media });

        res.status(201).json(result);
        return;
    } catch (err) {
        console.error(err);
        if (err.original) {
            res.status(500).json({ status: 500, message: err.original.sqlMessage });
        } else {
            res.status(500).json(errors.serverError);
        }
    }
};

const updateCustomerByID = async (req, res) => {
    const user = req.headers.user;
    if (user !== req.body.id) {
        res.status(400).json({
            ...errors.badRequest,
            message: "customer.id in body should be same as logged in user",
        });
        return;
    }
    const id = req.params.id;
    if (!id || id == 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const err = validationResult(req);
    if (!err.isEmpty()) {
        console.error(err);
        res.status(400).json({ status: 400, message: err.array() });
        return;
    }

    const customer = req.body;

    const dbRes = await Customer.findOne({ where: { id: id } });
    if (!dbRes) {
        res.status(404).json(errors.notFound);
        return;
    }

    try {
        dbRes.name = customer.name;
        dbRes.nickname = customer.nickname;
        dbRes.about = customer.about;
        dbRes.city = customer.city;
        dbRes.state = customer.state;
        dbRes.country = customer.country;
        dbRes.contact_no = customer.contact_no;
        if (customer.mediumId != 0) {
            dbRes.mediumId = customer.mediumId;
        }

        const updatedRes = await dbRes.save();
        const result = await Customer.findOne({ where: { id: updatedRes.id }, include: Media });

        res.status(200).json(result);
        return;
    } catch (err) {
        console.error(err);
        if (err.original) {
            res.status(500).json({ status: 500, message: err.original.sqlMessage });
        } else {
            res.status(500).json(errors.serverError);
        }
    }
};

const deleteCustomerByID = async (req, res) => {
    const id = req.params.id;
    if (!id || id == 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const customer = await Customer.findOne({ where: { id: id } });
    if (!customer) {
        res.status(401).send(errors.notFound);
        return;
    }

    try {
        await customer.destroy();
        res.status(200).send(null);
        return;
    } catch (err) {
        console.error(err);
        if (err.original) {
            res.status(500).json({ status: 500, message: err.original.sqlMessage });
        } else {
            res.status(500).json(errors.serverError);
        }
    }
};

module.exports = {
    getAllCustomers,
    getCustomerByID,
    createCustomer,
    updateCustomerByID,
    deleteCustomerByID,
};
