const DB = require("../../configurations/db");
const Formatted = require("./formatted.data");
// const TB_N = "n_devices";
const TB_N = "devices";
const TB_SS = "data_node";
const TB_MD = "station_mode";

const getDevices = async (req, res) => {
  console.log("getDevices");
  console.log(req.body);
  let sql = `SELECT * FROM ${TB_N}`;
  DB.query(sql, { type: DB.QueryTypes.SELECT })

    .then((results) => {
      console.log("nodes : ", results); // This logs the query results
      res.json({ status: "Success", devices: results });
    })
    .catch((err) => {
      res.json({ status: "Error", message: err });
    });
};
const getDevicesByUID = async (req, res) => {
  console.log("getDevicesByUID");
  // console.log(req.params);
  const U_ID = req.params.user_id;
  const sql = "SELECT * FROM " + TB_N + " WHERE user_id = :userId";
  try {
    const results = await DB.query(sql, {
      replacements: { userId: U_ID },
      type: DB.QueryTypes.SELECT,
    });

    // console.log("nodes : ", results);
    res.json({ status: "Success", devices: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
};

const getSenser = async (req, res) => {
  const nodeId = req.params.nodeId;
  console.log("getSenser", nodeId);
  let sql = `SELECT * FROM ${TB_SS} WHERE node_id = ${nodeId} ORDER BY data_id DESC LIMIT 1 `;
  console.log(sql);
  DB.query(sql, { type: DB.QueryTypes.SELECT })
    .then((results) => {
      res.json({ status: "Success", senser: results });
    })
    .catch((err) => {
      res.json({ status: "Error", message: err });
    });
};
const postDataNode = async (req, res) => {
  console.log("postDataNode");
  const data = req.body;
  console.log(data);
  console.log(data);
  const Date = await Formatted.fomattdDate();
  const Time = await Formatted.fomattdTime();
  console.log(Date, Time);

  const insertsql = `INSERT INTO ${TB_SS} (level, air_temp, air_humi, soil_mois, light, date, time, node_id) VALUES (?,?, ?, ?, ?, ?, ?, ?)`;
  DB.query(insertsql, {
    replacements: [
      data.level,
      data.air_temp,
      data.air_humi,
      data.soil_mois,
      data.light,
      Date,
      Time,
      data.node_id,
    ],
    type: DB.QueryTypes.INSERT,
  })
    .then(() => {
      res.json({
        status: "Success",
        code: "200",
        message: "Node Data added successfully",
      });
    })
    .catch((err) => {
      res.json({ status: "error", message: err, code: "500" });
      console.log(err);
    });
};
const getAllSenserChartData = async (req, res) => {
  console.log("getAllSenserData", req.params.nodeId);
  const nodeId = req.params.nodeId;
  const data = req.params.data;
  let sql = `SELECT * FROM ${TB_SS} WHERE node_id = ${nodeId}`;
  console.log(sql);
  DB.query(sql, { type: DB.QueryTypes.SELECT })
    .then((results) => {
      res.json({ status: "Success", chart: results });
    })
    .catch((err) => {
      res.json({ status: "Error", message: err });
    });
};
const getChartData = async (req, res) => {
  console.log("getAllSenserData", req.params.nodeId);
  const nodeId = req.params.nodeId;
  const data = req.params.data;
  let sql = `SELECT ${data}, date, time FROM ${TB_SS} WHERE node_id = ${nodeId} `;
  console.log(sql);

  DB.query(sql, { type: DB.QueryTypes.SELECT })
    .then((results) => {
      console.log("oneChart : ", results); // This logs the query results

      res.json({ status: "Success", oneChart: results });
    })
    .catch((err) => {
      res.json({ status: "Error", message: err });
    });
};
const postSetDataMode = async (req, res) => {
  console.log("postSetDataMode");
  const ID = req.params.nodeId;
  console.log("12315646"+req);
  try {
    const Date = await Formatted.fomattdDate(); 
    const Time = await Formatted.fomattdTime(); 

    const countQuery = `SELECT COUNT(*) as count FROM ${TB_MD} WHERE devices_node_id = ?`;
    const insertSql = `INSERT INTO ${TB_MD} (pump_st, current_level, go_level, st_mode, start_date, start_time, devices_node_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    // const updateSql = `UPDATE ${TB_MD} SET pump_st = ?, current_level = ?, go_level = ?, st_mode = ?, start_date = ?, start_time = ? WHERE devices_node_id = ?`;

    const result = await DB.query(countQuery, {
      replacements: [ID],
      type: DB.QueryTypes.SELECT,
    });
    console.log(countQuery);
    const count = result[0].count;
    console.log(count);

    if (count === 0) {
      await DB.query(insertSql, {
        replacements: ["OFF", "0", "0", "NONE", Date, Time, ID],
        type: DB.QueryTypes.INSERT,
      }).then((results) => {
        console.log(insertSql);
        console.log(result);
      });
      res.json({
        status: "Success",
        code: "200",
        message: "Node Data added successfully",
      });
    }
    // else if(count === 1){
    //   await DB.query(updateSql, {
    //     replacements: ["OFF", "0", "0", "NONE", Date, Time, ID],
    //     type: DB.QueryTypes.INSERT,
    //   }).then((results) => {
    //     console.log(updateSql);
    //     console.log(result);
    //   });
    //   res.json({
    //     status: "Success",
    //     code: "200",
    //     message: "Node Data added successfully",
    //   });
    // }
    else {
      res.json({
        status: "error",
        message: "Node Data already exists",
        code: "409",
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: err.message, code: "500" });
    console.error(err);
  }
};
const getModeData = async (req, res) => {
  console.log("getModeData", req.params.nodeId);
  console.log(req.params);
  const nodeId = req.params.nodeId;
  let sql = `SELECT *  FROM ${TB_MD} WHERE devices_node_id = ${nodeId} `;
  console.log(sql);

  DB.query(sql, { type: DB.QueryTypes.SELECT })
    .then((results) => {
      console.log("mode : ", results);

      res.json({ status: "Success", mode: results });
    })
    .catch((err) => {
      res.json({ status: "Error", message: err });
    });
};
const putMode = async (req, res) => {
  console.log('put');
  try {
    console.log("putMode 123465");
    const data = req.body;
    console.log(data);
    const date = await Formatted.fomattdDate();
    const time = await Formatted.fomattdTime();
    console.log(data);
    console.log(date, time);
    const sql = `UPDATE ${TB_MD} SET
      pump_st = :pump_st,
      current_level = :current_level,
      go_level = :go_level,
      st_mode = :st_mode,
      start_date = :start_date,
      start_time = :start_time
      WHERE devices_node_id = :devices_node_id`;

    const result = await DB.query(sql, {
      replacements: {
        pump_st: data.pump_st,
        current_level: data.current_level,
        go_level: data.go_level,
        st_mode: data.st_mode,
        start_date: date,
        start_time: time,
        devices_node_id: data.devices_node_id,
      },
      type: DB.QueryTypes.UPDATE,
    });
    console.log(result);

    const count = result[1];
    if (count > 0) {
      console.log(count);
      return res
        .status(200)
        .json({ status: "Success", message: "Mode updated successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "Error", message: "Unsuccess Mode updated " });
    }
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ status: "Error", message: err.message });
  }
};
module.exports = {
  getDevices,
  getDevicesByUID,
  postDataNode,
  // getStation,
  getSenser,
  getAllSenserChartData,
  getChartData,
  postSetDataMode,
  getModeData,
  putMode,
};
