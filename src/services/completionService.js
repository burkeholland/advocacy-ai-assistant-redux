export default {
  async getCompletion(messages, groundingSource, temperature) {
    // create an array that contains only the role and content properties of each message
    const completionMessages = messages.map((message) => {
      return {
        role: message.role,
        content: message.content
      }
    })

    const result = await fetch('/api/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        groundingSource: groundingSource,
        messages: completionMessages,
        temperature: temperature
      })
    })

    if (result.status === 500) {
      return {
        status: result.status,
        content: 'The server returned an internal error.'
      }
    }

    const data = await result.json()

    if (result.status !== 200) {
      return {
        status: result.status,
        content: `There was an error with the completion service: ${result.body}`
      }
    }

    data.usedTokens
    return {
      status: 200,
      usedTokens: data.usedTokens,
      content: data.content,
      contentPlain: data.contentPlain
    }
  }
}
