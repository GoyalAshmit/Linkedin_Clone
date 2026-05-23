import User from "../models/User.js"

// SEND REQUEST
export const sendConnectionRequest = async (req, res) => {

    try {

        const currentUserId = req.userId
        const targetUserId = req.params.id

        if (currentUserId === targetUserId) {
            return res.status(400).json({
                message: "Cannot connect to yourself"
            })
        }

        const currentUser = await User.findById(currentUserId)

        const targetUser = await User.findById(targetUserId)

        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // already connected
        if (
            currentUser.connections.includes(targetUserId)
        ) {
            return res.status(400).json({
                message: "Already connected"
            })
        }

        // already sent request
        if (
            currentUser.sentRequests.includes(targetUserId)
        ) {
            return res.status(400).json({
                message: "Request already sent"
            })
        }

        currentUser.sentRequests.push(targetUserId)

        targetUser.connectionRequests.push(currentUserId)

        await currentUser.save()

        await targetUser.save()

        res.status(200).json({
            message: "Request sent"
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Server Error"
        })
    }
}

// ACCEPT REQUEST
export const acceptConnectionRequest = async (req, res) => {

    try {

        const currentUserId = req.userId

        const senderId = req.params.id

        const currentUser =
            await User.findById(currentUserId)

        const senderUser =
            await User.findById(senderId)

        // remove pending request
        currentUser.connectionRequests =
            currentUser.connectionRequests.filter(
                (id) => id.toString() !== senderId
            )

        // remove sent request
        senderUser.sentRequests =
            senderUser.sentRequests.filter(
                (id) => id.toString() !== currentUserId
            )

        // add connections
        currentUser.connections.push(senderId)

        senderUser.connections.push(currentUserId)

        await currentUser.save()

        await senderUser.save()

        res.status(200).json({
            message: "Connection accepted"
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Server Error"
        })
    }
}