return new Promise((resolve, reject) => {
		verifyPassword(
			req.body.password,
			password,
			async (err: any, success: boolean) => {
				try {
					if (err) {
						const response = res.status(500).json({
							status: res.statusCode,
							method: req.method,
							message: `Internal Server Error ${err}`
						})
						resolve(response)
						return
					}

					if (!success) {
						const response = res.status(400).json({
							status: res.statusCode,
							method: req.method,
							message: 'username/password is wrong'
						})
						resolve(response)
						return
					}

					await knex<LogsDTO>('logs').insert({
						user_id: user_id,
						log_status: 'STATUS_LOGIN',
						log_time: dateFormat(new Date()),
						created_at: new Date()
					})

					const updateFirstLogin: number = await knex<UsersDTO>('users')
						.where({ email })
						.update({ first_login: dateFormat(new Date()) })

					if (updateFirstLogin > 0) {
						const response = res.status(200).json({
							status: res.statusCode,
							method: req.method,
							message: 'Login successfully',
							...token
						})
						resolve(response)
					} else {
						const response = res.status(500).json({
							status: res.statusCode,
							method: req.method,
							message: 'Failed to update user login time'
						})
						resolve(response)
					}
				} catch (error) {
					const response = res.status(500).json({
						status: res.statusCode,
						method: req.method,
						message: `Internal Server Error ${error}`
					})
					resolve(response)
				}
			}
		)
	})