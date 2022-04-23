export default new class logs{
    error(string=''){ console.log(`\x1b[31m${string}\x1b[0m`) }
    successful(string=''){ console.log(`\x1b[32m${string}\x1b[0m`) }
    error2(string=''){ console.log(`\x1b[91m${string}\x1b[0m`) }
    successful2(string=''){ console.log(`\x1b[92m${string}\x1b[0m`) }
}