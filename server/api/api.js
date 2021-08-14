const https = require('https');


async function apiGetCourse(courseId)
{
    const courseID = courseId.replace(" ","");

    return await new Promise((resolve, reject)=>{
        
    const options = {
        hostname: "api.peterportal.org",
        path: `/rest/v0/courses/${courseID}`,
        method: "GET"
    };

        https.get(options, (resp) => {
            if (resp.statusCode < 200 || resp.statusCode >= 300) {
                return reject(new Error('Status Code: ' + resp.statusCode));
            }
            let data = [];
            resp.on('data', function(chunk) {
                data.push(chunk);
            });
            resp.on('end', function() {
                try {
                    data = JSON.parse(Buffer.concat(data).toString());
                } catch(errror) {
                    reject(errror);
                }
                resolve(data);
            });
        }).on("error", (error) => {
            reject(error.message)
        }
        ).end()
    })
}

module.exports = apiGetCourse;
